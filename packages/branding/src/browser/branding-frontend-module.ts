import { ContainerModule } from 'inversify';
import './style/alembic-theme.css';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
    // This module is primarily for side-effects (loading CSS)
    // but we can register other branding-related contributions here if needed.
});
