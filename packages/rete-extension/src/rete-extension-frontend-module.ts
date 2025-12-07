import { ContainerModule } from 'inversify';
import { CommandContribution, MenuContribution } from '@theia/core';
import { WidgetFactory } from '@theia/core/lib/browser';
import { RetePreviewContribution } from './RetePreviewContribution';
import { ReteEditorWidget } from './ReteEditorWidget';
import { TabBarToolbarContribution } from '@theia/core/lib/browser/shell/tab-bar-toolbar/tab-bar-toolbar-registry';

export default new ContainerModule(bind => {
    bind(RetePreviewContribution).toSelf().inSingletonScope();
    bind(CommandContribution).toService(RetePreviewContribution);
    bind(MenuContribution).toService(RetePreviewContribution);
    bind(TabBarToolbarContribution).toService(RetePreviewContribution);

    bind(ReteEditorWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: ReteEditorWidget.ID,
        createWidget: (options: any) => {
            const widget = ctx.container.get(ReteEditorWidget);
            // Options might contain URI if passed from openPreview
            return widget;
        }
    })).inSingletonScope();
});
