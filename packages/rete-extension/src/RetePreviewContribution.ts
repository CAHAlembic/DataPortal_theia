
import { injectable, inject } from 'inversify';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService, URI } from '@theia/core/lib/common';
import { EditorManager, EditorWidget } from '@theia/editor/lib/browser';
import { WidgetManager, ApplicationShell } from '@theia/core/lib/browser';
import { ReteEditorWidget } from './ReteEditorWidget';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar/tab-bar-toolbar-registry';

export const RetePreviewCommand = {
    id: 'rete.openPreview',
    label: 'Open Preview to the Side',
    iconClass: 'codicon codicon-open-preview'
};

@injectable()
export class RetePreviewContribution implements CommandContribution, MenuContribution, TabBarToolbarContribution {

    @inject(CommandRegistry)
    protected readonly commandRegistry!: CommandRegistry;

    @inject(MenuModelRegistry)
    protected readonly menuRegistry!: MenuModelRegistry;

    @inject(EditorManager)
    protected readonly editorManager!: EditorManager;

    @inject(WidgetManager)
    protected readonly widgetManager!: WidgetManager;

    @inject(ApplicationShell)
    protected readonly shell!: ApplicationShell;

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(RetePreviewCommand, {
            execute: async () => this.openPreview(),
            // isVisible: () => this.isReteFileOpen() // Commented out for debugging
        });
    }

    registerMenus(registry: MenuModelRegistry): void {
        // Optional: Add to context menu or other menus if needed
    }

    registerToolbarItems(registry: TabBarToolbarRegistry): void {
        registry.registerItem({
            id: RetePreviewCommand.id,
            command: RetePreviewCommand.id,
            tooltip: RetePreviewCommand.label,
            priority: 0
        });
    }

    protected isReteFileOpen(): boolean {
        const widget = this.editorManager.currentEditor;
        // Check if it's an editor widget and has an editor
        const isRete = !!widget && !!widget.editor && widget.editor.uri.path.ext === '.rete';
        console.log('RetePreview: isReteFileOpen', {
            hasWidget: !!widget,
            hasEditor: !!widget?.editor,
            ext: widget?.editor?.uri.path.ext,
            result: isRete
        });
        return isRete;
    }

    protected async openPreview(): Promise<void> {
        console.log('RetePreview: openPreview called');
        const widget = this.editorManager.currentEditor;
        if (!widget || !widget.editor) {
            console.warn('RetePreview: No active editor found');
            return;
        }

        const uri = widget.editor.uri;
        console.log('RetePreview: Opening preview for', uri.toString());
        const widgetId = ReteEditorWidget.ID + ':' + uri.toString();

        const previewWidget = await this.widgetManager.getOrCreateWidget(ReteEditorWidget.ID, {
            id: widgetId,
            label: 'Preview: ' + uri.path.base,
            uri: uri.toString()
        });

        const reteWidget = previewWidget as ReteEditorWidget;
        await reteWidget.setUri(uri);

        if (!reteWidget.isAttached) {
            this.shell.addWidget(reteWidget, { area: 'main', mode: 'split-right' });
        }
        this.shell.activateWidget(reteWidget.id);
    }
}
