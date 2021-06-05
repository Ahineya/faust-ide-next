import {BehaviorSubject} from "rxjs";

export type TSidebarView = 'documents' | 'settings';
export type TRightSidebarView = 'diagram' | 'plot' | 'ui';

class LayoutStore {
  public onSidebarViewChanged = new BehaviorSubject<TSidebarView | null>(null);
  public onRightBarViewsChanged = new BehaviorSubject<TRightSidebarView[]>(['ui']);

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

  public togglePlot() {
    const rightSidebarViews = this.onRightBarViewsChanged.getValue();
    if (rightSidebarViews.includes('plot')) {
      this.onRightBarViewsChanged.next(rightSidebarViews.filter(v => v !== 'plot'));
    } else {
      this.onRightBarViewsChanged.next([...rightSidebarViews, 'plot']);
    }
  }

  public toggleUI() {
    const rightSidebarViews = this.onRightBarViewsChanged.getValue();
    if (rightSidebarViews.includes('ui')) {
      this.onRightBarViewsChanged.next(rightSidebarViews.filter(v => v !== 'ui'));
    } else {
      this.onRightBarViewsChanged.next([...rightSidebarViews, 'ui']);
    }
  }


}

export const layoutStore = new LayoutStore();
