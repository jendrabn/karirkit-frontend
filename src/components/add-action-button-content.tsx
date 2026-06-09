import { Plus } from "lucide-react";

export function AddActionButtonContent() {
  return (
    <>
      <Plus data-icon="inline-start" className="hidden min-[480px]:block" />
      <span>Tambah</span>
    </>
  );
}
