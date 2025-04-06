import { useEffect, useState } from "react";
import Container from "../../../components/common/Container";
import SearchBar from "../../../components/common/SearchBar";
import Button from "../../../components/common/Button";


import { toast } from "react-toastify";
import { deleteChallenge, getAllChallenges } from "../../../services";
import { Pen, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { getDateDifference, getDateByDay } from "../../../services/formatDate";
import { getChallenges } from "../../../services";
import Wrapper from "../../../components/common/Wrapper";
import HeaderTop from "../../../components/common/headerTop";
import Select from "../../../components/common/Select";

const TABLE_HEADERS = [
  "No",
  "Image",
  "Challenge name",
  "Workout type",
  "Status",
  "Duration(Days)",
  "Created at",
  "Updated at",
  "Action",
];

const filterUsers = (challenges, query) => {
  query.toString().toLowerCase();
  return challenges.filter((challenge) => {
    return (
      challenge.challengeName
        .split(" ")
        .some((word) => word.toLowerCase().startsWith(query)) ||
      challenge.workOutType
        .split(" ")
        .some((word) => word.toLowerCase().startsWith(query))
    );
  });
};

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [paginate, setPaginate] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    access: {
      access: {},
    }

  });
const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => {
  const getAllUsers = async() => {
try {
  const response = await getChallenges(paginate.page, paginate.limit);
  if(response.success) {
    setPaginate({
      ...paginate,
      total: response.data.pagination.total,
      totalPages: response.data.pagination.totalPages,
      currentPage: response.data.pagination.page,
      hasNextPage: response.data.pagination.hasNextPage,
      hasPrevPage: response.data.pagination.hasPrevPage
    })
    setChallenges(response.data.challenges)

  }
} catch (e) {
  console.log(e.message);
  
}
  }
  getAllUsers()
  }, [isSubmitting, paginate.page, paginate.limit]);
  const handleFilter = (e) => {
    setSearchText(e.target.value);
    setChallenges(() => filterUsers(challenges, searchText));
  };
  const handleDeleteChallenge = async (challengeId) => {
    try {
      const resp = await deleteChallenge(challengeId);
      if (resp.success) {
        setChallenges(
          challenges.filter((challenge) => challenge._id !== challengeId)
        );
        return toast.info(resp.message);
      }
    } catch (error) {
      // return toast.error(error.message);
    }
  };
  const handlePageChange = (page) => {  
    setPaginate({
      ...paginate,
      page: page,
    });
    setIsSubmitting(true)
  }

  const handleLimitChange = (limit) => {  
    setPaginate({
      ...paginate,
      limit: limit,
    });
    setIsSubmitting(true)

  }
  return (
    <Container>
    
      <Wrapper>
      <HeaderTop
      title={"Challenges"}
      />
        <div className="my-4 flex w-full justify-end">
                 <Link
                 to="/admin/challenges/create"
                 title="Create Challenge"
                 >
                 <Button
                    icon={Plus}
                    className="bg-violet-600 text-white"
                    name={"Challenge"}
                  />
                 </Link>
                </div>
        <div className="w-full overflow-x-auto dark:border-2 border-gray-800 bg-slate-100 px-4 py-6 dark:bg-gray-900">
          <div className="flex justify-end">
            <SearchBar
              placeholder="Search activities"
              value={searchText}
              onChange={handleFilter}
            />
          </div>
          <h2 className="mb-4 text-2xl text-gray-700 dark:text-gray-400">
            {`Challenges(${paginate && paginate.total})`}
          </h2>
          {
            <table className="min-w-full table-auto">
              <thead className="w-full">
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
                {challenges &&
                  challenges.map((data, index) => {
                    return (
                      data && (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          key={data && data._id}
                          className="divide-y-2 divide-gray-700 text-[.8rem]"
                        >
                          <td className="py-2 text-gray-400">{data && index + 1}</td>
                          <td className="py-2 text-gray-400">
                            <div className="flex aspect-square w-6 items-center overflow-hidden rounded-full">
                              <img
                                src={data && data.image.imageUrl}
                                alt="challenge image"
                                className="h-8 w-8 rounded-full"
                              />
                            </div>
                          </td>
                          <td className="py-2 text-gray-400">
                            {data && data.challengeName}
                          </td>
                          <td className="py-2 text-gray-400">
                            {data && data.workOutType}
                          </td>
        
                          <td className={`${data && data.status !== "In progress" ? "text-green-600" : "text-red-600"}`}>
                            {data && data.status}
                          </td>
                          {/* <td className={`py-2 text-gray-400 ${data && data.active? "text-green-600": "text-red-600"}`}>
                          {data && data.active? "Active": "Inactive"}
                        </td> */}
                          <td className="py-2 text-gray-400">
                            {data && getDateDifference(data.endDate, data.startDate)}
                          </td>
                          <td className="py-2 text-gray-400">
                            {getDateByDay(
                              (data && data.createdAt) || (data && data.joined)
                            )}
                          </td>
                          <td className="py-2 text-gray-400">
                            {getDateByDay(data && data.updatedAt)}
                          </td>
                          <td>
                            {/* <Link to={`/challenges/activity/${data._id}`}> */}
                            <Link to={`/admin/challenges/${data._id}`}>
                              <Button
                                icon={Pen}
                                className="text-violet-600"
                              ></Button>
                            </Link>
                            {/* </Link> */}
                          </td>
                          <td>
                            <Button
                              icon={Trash2}
                              className="text-red-600"
                              onClick={() =>
                                handleDeleteChallenge(data && data._id)
                              }
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
      </Wrapper>
    </Container>
  );
};

export default ChallengesPage;
