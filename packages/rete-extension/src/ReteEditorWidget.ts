import * as React from 'react';
import { injectable, postConstruct, inject } from 'inversify';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';
import { URI } from '@theia/core';
import { Range } from 'vscode-languageserver-types';
import { ReteGraph } from './ReteGraph';
import { EditorManager } from '@theia/editor/lib/browser';

@injectable()
export class ReteEditorWidget extends ReactWidget {

    static readonly ID = 'rete-editor';
    static readonly LABEL = 'Rete Editor';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @inject(EditorManager)
    protected readonly editorManager!: EditorManager;

    protected uri: URI | undefined;
    protected content: any = {};
    protected ignoreChange = false;

    @postConstruct()
    protected init(): void {
        this.id = ReteEditorWidget.ID;
        this.title.label = ReteEditorWidget.LABEL;
        this.title.caption = ReteEditorWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-window-maximize';
        this.update();
    }

    async setUri(uri: URI): Promise<void> {
        this.uri = uri;
        this.title.label = 'Preview: ' + uri.path.base;
        this.title.caption = uri.path.toString();

        await this.updateContentFromEditor();
        this.setupSync();
        this.update();
    }

    protected async updateContentFromEditor(): Promise<void> {
        if (!this.uri) return;

        // Find the open text editor for this URI
        const widget = this.editorManager.all.find(e => e.editor && e.editor.uri.toString() === this.uri!.toString());
        if (widget && widget.editor) {
            const value = widget.editor.document.getText();
            try {
                this.content = JSON.parse(value);
            } catch (e) {
                // Invalid JSON, maybe don't update graph or show error
                console.warn('Invalid JSON in editor', e);
            }
        }
    }

    protected setupSync(): void {
        if (!this.uri) return;

        // Listen for editor changes (Text -> Visual)
        // We need to listen to the specific editor model changes
        // A global listener on EditorManager might be easier to catch all changes
        // But ideally we want the specific document.

        // Since we don't have easy access to the document model event directly without keeping a reference to the editor,
        // let's try to find the editor again or use a global listener.
        // Actually, EditorManager doesn't emit content changes directly.
        // We might need to get the reference to the editor widget and listen to its document.

        // Better approach: When setUri is called, we find the editor and subscribe.
        const widget = this.editorManager.all.find(e => e.editor && e.editor.uri.toString() === this.uri!.toString());
        if (widget && widget.editor) {
            // Cast to any to avoid type issues if the interface is not exactly matching what we expect
            // But usually TextEditor has onDocumentContentChanged or document has onDidChangeContent
            const editor = widget.editor as any;
            if (editor.onDocumentContentChanged) {
                editor.onDocumentContentChanged(() => {
                    if (this.ignoreChange) return;
                    this.updateContentFromEditor().then(() => this.update());
                });
            } else if (editor.document && editor.document.onChanged) {
                editor.document.onChanged(() => {
                    if (this.ignoreChange) return;
                    this.updateContentFromEditor().then(() => this.update());
                });
            } else {
                console.warn('Could not find content change event on editor');
            }
        }
    }

    protected onDataChange = async (data: any) => {
        if (this.uri) {
            this.ignoreChange = true;
            try {
                const content = JSON.stringify(data, null, 2);

                const widget = this.editorManager.all.find(e => e.editor && e.editor.uri.toString() === this.uri!.toString());
                if (widget && widget.editor) {
                    const editor = widget.editor as any; // Cast to any to access replaceText if interface is missing it

                    const lineCount = editor.document.lineCount;
                    const endLine = Math.max(0, lineCount - 1);
                    const endCharacter = editor.document.getLineContent(endLine).length;

                    const range = Range.create(0, 0, endLine, endCharacter);

                    if (editor.replaceText) {
                        editor.replaceText(range, content);
                    } else {
                        console.warn('Editor does not support replaceText');
                    }
                }
            } catch (err) {
                console.error('Failed to sync visual -> text', err);
            } finally {
                // Debounce resetting ignoreChange to avoid loop
                setTimeout(() => { this.ignoreChange = false; }, 100);
            }
        }
    };

    protected render(): React.ReactNode {
        if (!this.uri) {
            return React.createElement('div', null, 'No file loaded');
        }
        return React.createElement(ReteGraph, {
            initialData: this.content,
            onSave: this.onDataChange
        });
    }
}
