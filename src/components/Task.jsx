const Task = ({
  // eslint-disable-next-line react/prop-types
  title,
  // eslint-disable-next-line react/prop-types
  description,
  // eslint-disable-next-line react/prop-types
  isCompleted,
  // eslint-disable-next-line react/prop-types
  updateHandler,
  // eslint-disable-next-line react/prop-types
  deleteHandler,
  // eslint-disable-next-line react/prop-types
  id
}) => {
  return (
    <div className="todo">
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      <div>
        <input onChange={()=>updateHandler(id)} type="checkbox" checked={isCompleted} />
        <button onClick={()=>deleteHandler(id)} className="btn">Delete</button>
      </div>
    </div>
  );
};

export default Task;
