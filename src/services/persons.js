import axios from "axios";
const base_url = "/api/persons";

const getAll = () => {
  const request = axios.get(base_url);
  return request.then((resonse) => resonse.data);
};

const create = (person) => {
  const request = axios.post(base_url, person);
  return request.then((response) => response.data);
};

const remove = (id) => {
  const request = axios.delete(base_url + id);
  return request.then((response) => response.data);
};

const update = (person) => {
  const request = axios.put(base_url + person.id, person);
  return request.then((response) => response.data);
};

export default {
  getAll,
  create,
  remove,
  update,
};
