import { useEffect, useRef, useState } from "react";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";
import { Button } from "./ui/Button";

interface NewProjectDialogProps {
  onProjectAddClick: (projectName: string) => void;
}

export function NewProjectDialog({ onProjectAddClick }: NewProjectDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState({ value: "", error: "" });

  useEffect(() => {
    if (name.error !== "") {
      nameRef.current?.focus();
    }
  }, [name.error]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold mb-4">
          Add New Project
        </DialogTitle>
      </DialogHeader>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.value) {
              setName({ ...name, error: "Project name is required" });
              return;
            }
            onProjectAddClick(name.value);
            closeRef.current?.click();
          }}
        >
          <label htmlFor="projectName" className="block mb-2">
            Project Name
          </label>
          <input
            id="projectName"
            ref={nameRef}
            type="text"
            value={name.value}
            onChange={(e) => setName({ value: e.target.value, error: "" })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button type="submit">Add</Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary" ref={closeRef}>
                Close
              </Button>
            </DialogClose>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
