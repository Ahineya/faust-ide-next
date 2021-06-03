import {useEffect, useState} from "react";
import {layoutStore, TSidebarView} from "../stores/layout-store";

export const useLeftSidebarView = () => {
  const [view, setView] = useState<TSidebarView | null>(null);

  useEffect(() => {
    const subscriptions = [
      layoutStore.onSidebarViewChanged.subscribe(view => {
        setView(view);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  return view;
}