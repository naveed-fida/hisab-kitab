import { useRef, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog";
import { Button } from "./ui/Button";
import { DialogClose } from "@radix-ui/react-dialog";

interface EditProjectDialogProps {
  project: { name: string };
  onSubmit: (name: string) => void;
}

export function EditProjectDialog({
  project,
  onSubmit,
}: EditProjectDialogProps) {
  const [name, setName] = useState({ value: project.name, error: "" });
  const nameRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleEdit = () => {
    if (name.value.trim() === "") {
      setName((preveName) => ({
        ...preveName,
        error: "Name is required",
      }));
      return;
    }

    onSubmit(name.value);
    closeRef.current?.click();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold mb-4">
          Edit {project.name}
        </DialogTitle>
      </DialogHeader>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEdit();
          }}
        >
          <label htmlFor="name" className="block mb-2">
            Name
          </label>
          <input
            ref={nameRef}
            id="name"
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={name.value}
            onChange={(e) => setName({ value: e.target.value, error: "" })}
          />
          {name.error ? (
            <p className="text-red-500 mt-2">{name.error}</p>
          ) : null}
          <div className="mt-4 flex justify-end gap-2">
            <Button type="submit" className="bg-blue-600 text-white">
              Save
            </Button>
            <DialogClose asChild>
              <Button ref={closeRef} type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
