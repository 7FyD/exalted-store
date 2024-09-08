"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "../../../_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../_components/ui/dialog";
import { Input } from "../../../_components/ui/input";
import { Label } from "../../../_components/ui/label";
import { addUsername, removeUsername } from "../HandleAccount";

import classes from "./index.module.scss";

export interface Account {
  name: string;
  id: string;
}

interface AccountModalProps {
  account: Account | null;
  onAccountUpdate: (account: Account | null) => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ account, onAccountUpdate }) => {
  const [username, setUsername] = useState(account?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    if (!username) {
      setError("Username cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const response = await addUsername(username);

    if ("error" in response) {
      setError(response.error);
    } else {
      setError("");
      setSuccess(response.success);
      onAccountUpdate(response.account);
      setTimeout(() => {
        setIsOpen(false);
      }, 200);
    }

    setIsSubmitting(false);
  };

  const handleRemove = async () => {
    const response = await removeUsername();
    if ("error" in response) {
      setError(response.error);
    } else {
      setError("");
      setSuccess(response.success);
      setUsername("");
      onAccountUpdate(null);
    }
  };

  const renderTriggerLabel = () => {
    if (account) {
      return (
        <div className="flex gap-4">
          <Image
            src={`https://mineskin.eu/helm/${account.name}/100.png`}
            alt="Minecraft skin"
            width={30}
            height={30}
            className="size-6 my-auto"
          />
          <p>
            {account.name} <span className="hidden md:inline-block"> - modify account</span>
          </p>
        </div>
      );
    }
    return "ADD ACCOUNT";
  };

  return (
    <Dialog
      modal={true}
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
        setError("");
        setSuccess("");
        setTimeout(() => {
          setUsername(account?.name || "");
        }, 100);
      }}
    >
      <DialogTrigger asChild>
        <Button className={`my-auto ${classes.label}`} variant="outline">
          {renderTriggerLabel()}
        </Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>{account ? "Modify" : "Add"} username</DialogTitle>
          <DialogDescription>
            Please be sure that this is your correct username! <br />
            (If you want to gift this package, use the other person's name for this field)
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="col-span-3"
            disabled={isSubmitting}
          />
          {error && <p className="col-span-4 text-center text-red-500">{error}</p>}
          {success && <p className="col-span-4 text-center text-emerald-500">{success}</p>}
        </div>
        <DialogFooter className="!flex-col gap-4">
          <Button
            className={classes.label}
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "SAVE USERNAME"}
          </Button>
          {account && (
            <Button variant="secondary" className={classes.label} onClick={handleRemove}>
              Remove account
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountModal;
