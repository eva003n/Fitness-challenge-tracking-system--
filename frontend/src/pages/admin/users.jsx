import { motion } from "motion/react";
import Container from "../../components/common/Container";
import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import { useEffect, useState } from "react";
import { getDateByDay, getDateByYear } from "../../services/formatDate";
import Button from "../../components/common/Button";
import Label from "../../components/common/label";
import Input from "../../components/common/input";
import { Pen, Trash2, ChevronLeft, ChevronRight, Plus, Loader } from "lucide-react";
import { toast } from "react-toastify";

import {
  createUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
  deleteUserAccount
} from "../../services";
import Scrim from "../../components/common/Scrim";
import Select from "../../components/common/Select";
import Wrapper from "../../components/common/Wrapper";
import HeaderTop from "../../components/common/headerTop";
const TABLE_HEADERS = ["Avatar", "Username", "Email", "Role","Status", "Joined", "Updated at", "Action"];
const TABLEDATA = [
  {
    _id: "1as5sf3h7ebh3by3b2di4rv38",
    avatar:"",
    name: "John Doe",
    email: "hDj7I@example.com",
    role: "user",
    status: "Active",

    joined: "2022-01-01",
  },
  {
    _id: "2as5sf3h7ebh3by3b2di4rv38",
    avatar:"",

    name: "Jane Doe",
    email: "yVdX4@example.com",
    role: "user",
    status: "Active",

    joined: "2022-02-01",
  },
  {
    _id: "3as5sf3h7ebh3by3b2di4rv38",
    avatar:"",
    name: "John Smith",
    email: "M9GQ5@example.com",
    role: "user",
    status: "Active",

    joined: "2022-03-01",
  },
  {
    _id: "4as5sf3h7ebh3by3b2di4rv38",
    avatar: "",
    name: "Jane Smith",
    email: "XHv0d@example.com",
    role: "user",
    status: "Active",
    joined: "2022-04-01",
  },
  {
    _id: "5as5sf3h7ebh3by3b2di4rv38",
    avatar: "",
    name: "John Doe",
    email: "hDj7I@example.com",
    role: "admin",
    status: "Inactive",
    joined: "2022-05-01",
  },
];
const filterUsers = (users, query) => {
  query.toString().toLowerCase();
  return users.filter((user) => {
    return (
      user.email
        .split(" ")
        .some((word) => word.toLowerCase().startsWith(query)) ||
      user.userName.split(" ").some((word) => word.toLowerCase().startsWith(query))
    );
  });
};
const Users = () => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState(() => {
    return []
});
const [isOpen, setIsOpen] = useState(false)
const [isLoading, setIsLoading] = useState(false);
const [isUpdate, setIsupdate] = useState(false)
const [isSubmit, setIsSubmit] = useState(false)
const [data, setData] = useState({
  email:"",
  password: "",
  role: "user",
  joined: "",

})
const [paginate, setPaginate] = useState({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  currentPage: 1,
  hasNextPage: false,
  hasPrevPage: false,
  
})


useEffect(() => {
const getAllUsers = async() => {
  const response = await getUsers(paginate.page, paginate.limit)
  if(response.success) {
    console.log(response.data.pagination)
    setPaginate({
      ...paginate,
      total: response.data.pagination.total,
      totalPages: response.data.pagination.totalPages,
      currentPage: response.data.pagination.page,
      hasNextPage: response.data.pagination.hasNextPage,
      hasPrevPage: response.data.pagination.hasPrevPage
    })
    setUsers(response.data.users)

  }
}
getAllUsers()
}, [isSubmit, paginate.page, paginate.limit]);

  const handleFilter = (e) => {
    setSearchText(e.target.value);
    setUsers(() => filterUsers(users, searchText));
  };
  const handleDeleteActivity = async (userId) => {
    try {
       const response = await deleteUserAccount(userId);
      if (true) {
        toast.info(response.message);
        setUsers(users.filter((user) => user._id !== userId));
         setIsSubmit(() => true);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const handleShow = () => {
    isOpen ? setIsOpen(false) : setIsOpen(true);
  };
  const handleEdit = async (userId) => {
    try {
      setIsupdate(true)
      // setIsOpen(true)
      const response = await getUserProfile(userId);
      if (response.success) {
        setIsupdate(true);
        setData(response.data);
        setIsOpen(true);
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsLoading(true);
      const response = !isUpdate
        ? await createUser(data)
        : await updateUserProfile(data._id, data);

      if (response.success) {
        toast.info(response.message);

        setIsLoading(false);
        //causethe use effect to re-render and set updated data
        setIsSubmit(() => true);
      }
    } catch (e) {
      setIsLoading(false);
      toast.error(e.message);
      console.log(e);
    }finally {
      setIsLoading(false)
    }
  };

  const handlePageChange = (page) => {  
    setPaginate({
      ...paginate,
      page: page,
    });
    setIsSubmit(() => true);

  }
  const handleLimitChange = (limit) => {  
    setPaginate({
      ...paginate,
      limit: limit,
    });
    setIsSubmit(() => true);

  }

  return (
    <Container>
   
    <Wrapper>
    <HeaderTop
      title={"Users"}
      />
      <div className="my-4 flex w-full justify-end">
            <Button
              icon={Plus}
              className="bg-violet-600 text-white"
              name={"user"}
              onClick={handleShow}
            />
          </div>
        <div className="w-full overflow-x-auto bg-slate-100 px-4 py-6 dark:bg-gray-900 dark:border-2 border-gray-800">
          <div className="flex justify-end">
            <SearchBar
              placeholder="Search activities"
              value={searchText}
              onChange={handleFilter}
            />
          </div>
          <h2 className="mb-4 text-2xl text-gray-700 dark:text-gray-400">
            {`Users(${paginate && paginate.total})`}
          </h2>
          {
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  {TABLE_HEADERS.map((header, index) => (
                    <th
                      className="py-4 text-left font-medium tracking-wider text-gray-400"
                      key={index}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users && users.map((data, index) => {
                  return (
                    data && (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        key={data && data._id}
                        className="divide-y-2 divide-gray-700 text-[.8rem]"
                      >
                        <td className="py-2 text-gray-400">
                          <divv className="flex items-center overflow-hidden w-6 aspect-square rounded-full">
                            <img
                              src={data && data.avatar.imageUrl}
                              alt="avatar"
                              className="w-8 h-8 rounded-full"
                            />
                          </divv>
                        </td>
                        <td className="py-2 text-gray-400">
                          {data && data.userName}
                        </td>
                        <td className="py-2 text-gray-400">
                          {data && data.email}
                        </td>
                        <td className="py-2 text-gray-400">
                          {data && data.role}
                        </td>
                        <td className={`py-2 text-gray-400 ${data && data.active? "text-green-600": "text-red-600"}`}>
                          {data && data.active? "Active": "Inactive"}
                        </td>
                        <td className="py-2 text-gray-400">
                          {getDateByDay(
                            (data && data.createdAt) || (data && data.joined)
                          )}
                        </td>
                        <td className="py-2 text-gray-400">
                          {getDateByDay(
                            (data && data.updatedAt)
                          )}
                        </td>
                        {/* <td className="py-2 text-gray-400">
                            {data && data.duration}
                          </td> */}
                        <td>
                          {/* <Link to={`/challenges/activity/${data._id}`}> */}
                          <Button
                            icon={Pen}
                            className="text-violet-600"
                            onClick={(e) => handleEdit(data._id, data)}
                          ></Button>
                          {/* </Link> */}
                        </td>
                        <td>
                          <Button
                            icon={Trash2}
                            className="text-red-600"
                            onClick={() => handleDeleteActivity(data && data._id)}
                          ></Button>
                        </td>
                      </motion.tr>
                    )
                  );
                })}
              </tbody>
            </table>
          }
          <div className="mt-2 flex justify-end  text-gray-300">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <p className="text-gray-400 grow">Limit rows</p>
                <Select
                  name={"limit"}
                  value={paginate.limit}
                  onChange={(e) => handleLimitChange(e.target.value)}
                  className="w-4"
                >
              
                  {/* <option value="1">1</option> */}
                  {/* <option value="3">3</option> */}
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  </Select>
              </div>
                   <div className="flex items-center gap-2">
                     <p>
                                 {`${paginate && paginate.page || 0} of ${paginate && paginate.totalPages || 0}` }
              
                               </p>
                                 <Button
                                   icon={ChevronLeft}
                                   className="disabled:text-gray-700"
                                   disabled={paginate && !paginate.hasPrevPage}
                                   onClick={() => handlePageChange(paginate.page - 1)}
                                 />
                                 <Button
                                   icon={ChevronRight}
                                   className="disabled:text-gray-700"
                                    disabled={paginate && !paginate.hasNextPage}
                                   onClick={() => handlePageChange(paginate.page + 1)}
                                 />
                   </div>
            </div>
          </div>
        </div>
        {isOpen && (
            <Scrim onShow={handleShow}>
              <form
                onSubmit={(e) => handleSubmit(e)}
                className="grid w-[20rem] max-w-[25rem] gap-1 bg-gray-900 p-4 border-2 border-gray-700"
              >
                <h2 className="text-center font-medium text-gray-300">
                  {isUpdate ? "Update user" : "Add user"}
                </h2>
                <Label name={"Email"} />
                <Input
                  type="text"
                  name={"email"}
                  value={data.email}
                  className="px-2 bg-slate-900"
                  onChange={handleChange}
                  required
                />
                <Label name={"Password"} />
                <Input
                  type="password"
                  name={"password"}
                  value={data.password}
                  className="px-2"
                  onChange={handleChange}
                  // required
                />
      
      
      
                  <div className="flex grow flex-col gap-2">
                    <Label name={"Role"} />
                    <Select
      
                      name="role"
                      value={data.role}
                      onChange={handleChange}
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </Select>
                  </div>
      
      
                <Label name={"Joined"} />
                <Input
                  type="date"
                  name="joined"
                  className="px-2"
                  // value={isUpdate? getDateByMonth(data.date): data.date}
                  value={isUpdate ? getDateByYear(data.createdAt) : data.joined}
                  onChange={handleChange}
                  required
                />
                <Button
                  name={
                    !isUpdate
                      ? isLoading
                        ? "Creating"
                        : "Create"
                      : isLoading
                        ? "Updating"
                        : "Update"
                  }
                  className="w-full bg-violet-600 text-white"
                  icon={isLoading && Loader}
                  loader={true}
                  isLoading={isLoading}
                  // onClick={() => setIsOpen(false)}
                />
              </form>
            </Scrim>
          )
        }
    </Wrapper>
    </Container>
  );
};

export default Users;
