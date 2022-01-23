import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MessageContext from "../../Context/Messages/MessageContext";
import useApi from "../../Hooks/useApi";
import Label from "../label/Label";
import AddLabel from "../LabelBox/AddLabel";
import Button from "../Ui/Button/Button";
import Flex from "../Ui/Flex/Flex";
import Input from "../Ui/Input/Input";
import Classes from "../Blog/Blog.module.css";
import Loader from "../Loader/Loader";
import RClasses from "./Roadmap.module.css";
function NewRoadmap() {
  const Navigate = useNavigate();
  const Message = useContext(MessageContext);
  const { UserRequest, Request, Data, Loading } = useApi();
  const [Labels, updateLabels] = useState([]);
  const [AddedLabels, updatelabel] = useState([]);
  const [File, updateFile] = useState(null);
  const [Title, updateTitle] = useState("");
  const [Caption, updateCaption] = useState("");
  const HandelChange = (event) => {
    if (event.target.name === "Title") {
      updateTitle(event.target.value);
    } else if (event.target.name === "About") {
      updateCaption(event.target.value);
    }
  };
  const newLabel = (Label, color) => {
    if (!AddedLabels.includes(Label)) {
      updatelabel([...AddedLabels, Label]);
      updateLabels([...Labels, { Label, color }]);
    }
  };
  const HandelUpload = (event) => {
    updateFile(event.target.files[0]);
  };
  const handelSubmit = async () => {
    let FileName;
    if (File !== null) {
      const data = new FormData();
      FileName = Date.now() + File.name;
      data.append("FileName", FileName);
      data.append("file", File);
      await Request("/Image/Upload/", "POST", data);
      var RoadmapData = {
        Title: Title,
        Caption: Caption,
        Roadmap: FileName,
        Labels: Labels,
      };
      File !== null && (RoadmapData.Image = FileName);
      await UserRequest("/Blog", "POST", RoadmapData);
    } else {
      Message.Add_Message("Error", "Please upload a Roadmap");
    }
  };
  useEffect(() => {
    if (Data.Status === "Success") {
      Message.Add_Message("Success", "SuccessFully Post your Blog");
      setTimeout(() => {
        Navigate("/Explore");
      }, 1000);
    }
    // eslint-disable-next-line
  }, [Data]);
  return (
    <Flex className={RClasses.Roadmap_Box}>
      {File !== null && (
        <img
          src={URL.createObjectURL(File)}
          className={Classes.UploadedImageBox}
          alt="UploadedImage"
        />
      )}
      <Button className={Classes.Btn} style={{ width: "200px" }}>
        <label htmlFor="Image" style={{ width: "200px", fontSize: "15px" }}>
          Upload a Roadmap
        </label>
      </Button>
      <input
        type="file"
        name="file"
        id="Image"
        style={{ display: "none" }}
        onChange={HandelUpload}
      />
      <Input
        name="Title"
        placeholder="Give Title to your Blog"
        type="text"
        value={Title}
        onChange={HandelChange}
        required={true}
      />
      <Input
        name="About"
        placeholder="Small Caption for your Blog"
        type="text"
        value={Caption}
        onChange={HandelChange}
        required={true}
      />
      {Labels.length !== 0 && (
        <Flex className={Classes.LabelBox}>
          <h3>Added Labels</h3>
          <Flex className={Classes.Wrap}>
            {Labels.map((label) => {
              return (
                <Label
                  label={label.Label}
                  color={label.color}
                  className={Classes.Label}
                />
              );
            })}
          </Flex>
        </Flex>
      )}
      <AddLabel AddLabel={newLabel} />
      {Loading && <Loader />}
      {!Loading && (
        <Button onClick={handelSubmit} className={Classes.Btn}>
          Upload Roadmap
        </Button>
      )}
    </Flex>
  );
}

export default NewRoadmap;
