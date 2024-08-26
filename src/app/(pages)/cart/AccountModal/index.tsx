"use client";

import { useState } from "react";

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
import { CheckAccount } from "../CheckAccount";

import classes from "./index.module.scss";

const AccountModal = () => {
  const [username, setUsername] = useState("");

  const handleSubmit = async () => {
    const response = await CheckAccount(username);
    console.log(response);
    //TODO: handle response by adding a toast + cookie in backend
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={`my-auto ${classes.label}`} variant="outline">
          ADD MINECRAFT ACCOUNT
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add username</DialogTitle>
          <DialogDescription>
            Please be sure that this is your correct username! <br />
            (If you want to gift this package use the other person's name for this field)
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
          />
        </div>
        <DialogFooter>
          <Button className={classes.label} type="submit" onClick={handleSubmit}>
            SAVE USERNAME
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountModal;
