"use client";

import { useState } from "react";

export function useDeleteConfirmation<T extends { id: string }>({
  endpoint,
  onSuccess,
}: {
  endpoint: (item: T) => string;
  onSuccess: () => void;
}) {
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(endpoint(itemToDelete), { method: "DELETE" });
      if (response.ok) {
        setItemToDelete(null);
        onSuccess();
      } else {
        console.error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return { itemToDelete, setItemToDelete, isDeleting, handleConfirmDelete };
}
