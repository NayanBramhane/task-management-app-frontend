import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Task from "../components/Task";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Home = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // created new loading variable for task so as to not get the user's loading true accidently
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { isAuthenticated, setUser, setIsAuthenticated } = useContext(Context);

  const server = import.meta.env.VITE_BASE_URI;

  const updateHandler = async (id) => {
    try {
      const { data } = await axios.put(
        `${server}/task/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/task/${id}`, {
        withCredentials: true,
      });
      toast.success(data.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${server}/task/new`,
        { title, description },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message);
      setLoading(false);
      setTitle("");
      setDescription("");
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // listing all available tasks
  useEffect(() => {
    axios
      .get(`${server}/task/my`, {
        withCredentials: true,
      })
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  }, [refresh]);

  // setting user in client side to show in profile
  useEffect(() => {
    setLoading(true);

    axios
      .get(`${server}/users/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setUser({});
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);

  // if not logged in return to login
  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <div className="container">
      <div className="login">
        <section>
          <form onSubmit={submitHandler}>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="Title"
              required
            />
            <input
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              placeholder="Description"
              required
            />
            <button disabled={loading} type="submit">
              Create Task
            </button>
          </form>
        </section>
      </div>
      <section className="todosContainer">
        {tasks.map((task) => (
          <Task
            key={task._id}
            title={task.title}
            description={task.description}
            isCompleted={task.isCompleted}
            updateHandler={updateHandler}
            deleteHandler={deleteHandler}
            id={task._id}
          />
        ))}
      </section>
    </div>
  );
};

export default Home;
