import {useState} from "react";
//components
import Label from "../../../components/common/label";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/input";
import TextArea from "../../../components/common/textArea";
import { X, CloudUpload } from "lucide-react";
import { createChallenge } from "../../../services";
import Container from "../../../components/common/Container";
import HeaderTop from "../../../components/common/headerTop";
import {Loader} from "lucide-react"
import { toast } from "react-toastify";
import { useAuth } from "../../../context/authProvider";



const CreateChallenge = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState("");
  const {user} = useAuth()
  const [data, setData] = useState({
    challengeName: "",
    description: "",
    workOutType: "",
    startDate: "",
    createdBy:user._id,
    endDate: "",
    status: "In progress",
    difficulty: "Beginner",
    image: "",
    instructions: "",
    access: "Public",
  });
  const handleDataSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log(data)
      setIsLoading(true);
      const response = await createChallenge(data);

      if (response.success) {
        toast.info(response.message);
        setIsLoading(false);
        setData({
          challengeName: "",
          description: "",
          workOutType: "",
          startDate: "",
          endDate: "",
          difficulty: "",
          image: "",
          createdBy: "",
          access: "",
          instructions: "",
          
        })
      }
    } catch (e) {
      toast.error(e.response.error);
      console.log(e);
      setIsLoading(false);
    }finally {
      setIsLoading(false)
    }
  };
  const handleChange = (e) => {
    const { files, name, value } = e.target;

    if (files) {
      let [file] = files;
      const reader = new FileReader();

      reader.onload = () => {
        file = reader.result;
        setThumbnail(file);
        file &&
          setData({
            ...data,

            [name]: files[0],
          });
      };
      reader.readAsDataURL(file);
    } else {
      setData({
        ...data,
        [name]: value,
      });
    };
  }
  const handleDelete = () => {
    setData({
      ...data,
      image: "",
    });
    setThumbnail("");
  };
  return (
    <Container>
    <HeaderTop
    title ={"Create Challenge"}
    description ={"Create a new challenge"}
    />
       <form
        onSubmit={(e) => handleDataSubmit(e)}
        className="mx-auto  max-w-[36rem] grid gap-4 rounded-lg outline-2 outline-gray-700 bg-gray-100 px-4 py-8 text-violet-700  dark:bg-slate-900"
        disabled={isLoading}
      >
        <div className="grid gap-2">
          <Label htmlFor="title" name={"Title"}></Label>
          <Input
            type="text"
            name="challengeName"
            autoComplete="off"
            value={data.challengeName}
            className="px-3 dark:bg-slate-800"
            onChange={(e) => handleChange(e)}
            required

          />
          <Label htmlFor="decription" name="Description"></Label>
          <Input
            name="description"
            type="text"
            value={data.description}
            autoComplete="off"
            placeholder="Add a short description"
            className="px-3 dark:bg-slate-800"
            onChange={(e) => handleChange(e)}
            required
          />
          <Label name={"Workout"}></Label>
          <Input
            name="workOutType"
            type="text"
            value={data.workOutType}
            className="px-3 dark:bg-slate-800"
            onChange={(e) => handleChange(e)}
            required
          />
          <Label name={"Difficulty"}></Label>
          <Select
            value={data.difficulty}
            name="difficulty"
            onChange={(e) => handleChange(e)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Select>
          <Label name={"Duration"}></Label>
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <div className="grid grow gap-1">
              <Label name={"Start"}></Label>
              <Input
                name="startDate"
                type="date"
                value={data.startDate}
                className="px-3 dark:bg-slate-800"
                onChange={(e) => handleChange(e)}
            required

              />
            </div>
            <div className="grid grow gap-1">
              <Label name={"End"}></Label>
              <Input
                name="endDate"
                type="date"
                value={data.endDate}
                className="px-3 dark:bg-slate-800"
                onChange={(e) => handleChange(e)}
            required

              />
            </div>
          </div>
         <div className=" grid gap-2">
          <div><Label name="Access level"></Label></div>
          <Label htmlFor="access"  name="Public" className="flex items-center gap-2">
            <Input
            name="access"
            type="radio"
            value="Public"
            onChange={(e) => handleChange(e)}
            checked={data.access === "Public"}
            className="accent-violet-600"

            />
          </Label>
          <Label htmlFor="access" name ="Private" className="flex items-center gap-2">
            <Input
            name="access"
            type="radio"
            value="Private"
            onChange={(e) => handleChange(e)}
            className="accent-violet-600"
            checked={data.access === "Private"}
            />
          </Label>
         </div>
        </div>
        <Label name="Instructions"></Label>
        <TextArea
         name="instructions"
         type="text"
         value={data.instructions}
         autoComplete="off"
         placeholder="Add a some instructions"
         className="px-3 dark:bg-slate-800"
         onChange={(e) => handleChange(e)}

        />
        <div className=" grid gap-2">
          <div className="flex items-center justify-center bg-gray-800 h-[16rem] p-4">
            {thumbnail || data.image.imageUrl ? (
              <div className="relative w-full rounded-sm max-w-[16rem]  flex items-center ">
                <X
                  className="absolute -right-2 -top-3 cursor-pointer rounded-full bg-white text-black"
                  onClick={handleDelete}
                  size={18}
                  strokeWidth={2}
                />
                <img
                  src={thumbnail || data.image.imageUrl}
                  alt="thumbnail"
                  className="h-[10rem] w-full rounded-sm object-cover"
                />
              </div>
            ) : (
              <div>
                <div className="flex gap-4">
                  <CloudUpload size={24} color="#eee" />
                  <Label htmlFor={"image"} name={"Upload image"}></Label>
                </div>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleChange(e)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
              icon={isLoading && Loader}
              isLoading={isLoading}
              loader={true}
              name={isLoading ? "Creating ..." : "Create"}
              className="bg-violet-600 text-[1rem] tracking-wide text-white"
              disabled={Object.values(data).some((value) => !value ) || isLoading}

              // disabled={Object.values(data).some((value) => !value === "duration" || !value)}
            ></Button>
        </div>
      </form>
    
  </Container>
  )
};

export default CreateChallenge;
