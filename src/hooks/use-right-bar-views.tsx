import {useEffect, useState} from "react";
import {layoutStore, TRightSidebarView} from "../stores/layout-store";

export const useRightBarViews = () => {
  const [views, setViews] = useState<TRightSidebarView[]>([]);

  useEffect(() => {
    const subscriptions = [
      layoutStore.onRightBarViewsChanged.subscribe(views => {
        setViews(views);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  return views;
}