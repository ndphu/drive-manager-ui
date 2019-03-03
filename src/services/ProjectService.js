import api from "../api/Api";


class ProjectService {
  getProjects = (page, size) => {
    if (!page) page = 1;
    if (!size) size = 10;
    return api.get(`/project?page=${page}&size=${size}`)
  };

  createProject = (project) => {
    const formData = new FormData();
    formData.append("displayName", project.displayName);
    formData.append("file", project.keyFile);
    return api.postForm("/project", formData);
  };

  getProjectById = (id) => {
    return new Promise((resolve, reject)=> {
      api.get(`/project/${id}`).then(resp => {
        const project = resp;
        api.get(`/project/${id}/accounts`).then(accounts => {
          project.accounts = accounts;
          resolve(project);
        })
      })
    });
  };

  addServiceAccount = (id) => {
    return api.post(`/project/${id}/addServiceAccount`)
  };
}


const projectService = new ProjectService();

export default projectService;