import { createSelector } from "@reduxjs/toolkit";

export const selectAllNotifications = (state) => state.root.NotifyService.data;

export const selectNotifyState = (state) =>
  state.root.NotifyService.hasPendingNotifications;

export const selectNotifyStatus = (state) => state.root.NotifyService.status;

export const selectNotifyQueue = (state) => state.root.NotifyService.queue;

export const selectNotifyArchive = (state) => state.root.NotifyService.archive;

export const selectNotifyUnreadCount = createSelector(
  [selectNotifyArchive],
  (notifyArchived) => {
    let count = 0;
    notifyArchived.forEach(({ read }) => {
      !read && ++count;
    });
    return count;
  }
);

export const selectNotifyUnread = createSelector(
  [selectNotifyArchive],
  (notifyArchived) => notifyArchived.filter(({ read }) => !read)
);

export const selectNotifyRead = createSelector(
  [selectNotifyArchive],
  (notifyArchived) => notifyArchived.filter(({ read }) => !!read)
);
