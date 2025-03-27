//icons
import { X, Loader, CloudUpload } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Label from "../../components/common/label";
import Select from "../../components/common/Select";
import Input from "../../components/common/input";
import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import { useAuth } from "../../context/authProvider";
import { useState, useEffect } from "react";
import { getChallengeData } from "../../services";
import { getDateByYear } from "../../services/formatDate";
import { updateChallenge } from "../../services";

const EditChallenge = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState("");
  const [data, setData] = useState({
    challengeName: "",
    description: "",
    workOutType: "Running",
    startDate: "",
    endDate: "",
    difficulty: "Beginner",
    image: "",
    createdBy: user._id,
    status: "",
  });

  useEffect(() => {
    const getChallenge = async () => {
      const response = await getChallengeData(id);

      if (response.success) {
        console.log(response.data);

        setData(response.data);
      }
    };
    getChallenge();
  }, []);
  console.log(data);

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
    }
    6;
  };
  const handleDataSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const response = await updateChallenge(data, id);

      if (response.success) {
        toast.info(response.message);
        setIsLoading(false);
      }
    } catch (e) {
      toast.error(e.response.error);
      console.log(e);
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    setData({
      ...data,
      image: "",
    });
    setThumbnail("");
  };

  return (
    <Container>
      -
      <form
        onSubmit={(e) => handleDataSubmit(e)}
        className="mx-auto grid max-w-[56rem] gap-4 rounded-lg bg-gray-100 px-4 py-8 text-violet-700 md:grid-cols-2 dark:bg-slate-800"
        disabled={isLoading}
      >
        <div className="grid gap-2">
          <Label htmlFor="title" name={"Title"}></Label>
          <Input
            type="text"
            name="challengeName"
            autoComplete="off"
            value={data.challengeName}
            className="px-3 dark:bg-slate-700"
            onChange={(e) => handleChange(e)}
          />
          <Label htmlFor="decription" name="Description"></Label>
          <Input
            name="description"
            type="text"
            value={data.description}
            autoComplete="off"
            className="px-3 dark:bg-slate-700"
            onChange={(e) => handleChange(e)}
          />
          <Label name={"Workout"}></Label>
          <Select
            value={data.workOutType}
            name="workOutType"
            onChange={(e) => handleChange(e)}
          >
            <option value="Running">Running</option>
            <option value="Walking">Walking</option>
            <option value="Strength training">Strength training</option>
            <option value="Cycling">Cycling</option>
          </Select>
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
          <div className="">
            <Label name={"Status"}></Label>
            <Input
              name="status"
              type="text"
              value={data.status}
              className="px-3 dark:bg-slate-700"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <Label name={"Duration"}></Label>
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <div className="grid grow gap-1">
              <Label name={"Start"}></Label>
              <Input
                name="startDate"
                type="date"
                value={getDateByYear(data.startDate)}
                className="px-3 dark:bg-slate-700"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="grid grow gap-1">
              <Label name={"End"}></Label>
              <Input
                name="endDate"
                type="date"
                value={getDateByYear(data.endDate)}
                className="px-3 dark:bg-slate-700"
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <Button
            icon={isLoading && Loader}
            isLoading={isLoading}
            loader={true}
            name={isLoading ? "Updating" : "Update"}
            className="bg-violet-600 text-[1rem] tracking-wide text-white"
            disabled={isLoading}

            // disabled={Object.values(data).some((value) => !value === "duration" || !value)}
          ></Button>
        </div>
        <div className="min-h-50 grid gap-2">
          <div className="flex items-center justify-center bg-gray-700">
            {thumbnail || data.image.imageUrl ? (
              <div className="relative h-1/2 w-1/2 rounded-sm">
                <X
                  className="absolute -right-2 -top-3 cursor-pointer rounded-full bg-white text-black"
                  onClick={handleDelete}
                  size={18}
                  strokeWidth={2}
                />
                <img
                  src={thumbnail || data.image.imageUrl}
                  alt="thumbnail"
                  className="h-full w-full rounded-sm object-cover"
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
      </form>
    </Container>
  );
};
export default EditChallenge;
