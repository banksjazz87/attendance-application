import React, { useState } from "react";
import postData from "../../functions/api/post.ts";
import { Group } from "../../types/interfaces.ts";

export default function NewGroupForm() {
  const [groupName, setGroupName] = useState<Group>({ name: "" });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setGroupName({ ...groupName, name: e.target.value });
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    postData("/new-group", groupName).then((data: object) => console.log(data));
  };

  return (
    <div id="new_group_wrapper">
      <form method="post" onSubmit={submitHandler}>
        <label id="new_group" htmlFor="new_group">
          Group Name
        </label>
        <input type="text" id="new_group" onChange={changeHandler} />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
