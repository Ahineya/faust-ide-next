import {BehaviorSubject} from "rxjs";

export type TSidebarView = 'documents' | 'settings';
export type TRightSidebarView = 'diagram';

class LayoutStore {
  public onSidebarViewChanged = new BehaviorSubject<TSidebarView | null>(null);
  public onRightBarViewsChanged = new BehaviorSubject<TRightSidebarView[]>([]);

  public showDocuments() {
    this.onSidebarViewChanged.next("documents");
  }

  public showSettings() {
    this.onSidebarViewChanged.next("settings");
  }

  public hideSidebar() {
    this.onSidebarViewChanged.next(null);
  }

  public toggleDiagram() {
    const rightSidebarViews = this.onRightBarViewsChanged.getValue();
    if (rightSidebarViews.includes('diagram')) {
      this.onRightBarViewsChanged.next(rightSidebarViews.filter(v => v !== 'diagram'));
    } else {
      this.onRightBarViewsChanged.next(['diagram', ...rightSidebarViews]);
    }
  }
}

export const layoutStore = new LayoutStore();
