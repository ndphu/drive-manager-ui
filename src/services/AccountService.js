import api from "../api/Api";


class AccountService {
  getDriveAccounts = (page, size) => {
    if (!page) page = 1;
    if (!size) size = 10;
    return api.get(`/manage/driveAccount?page=${page}&size=${size}`)
  };

  createAccount = (account) => {
    return api.post("/manage/driveAccount", account)
  };

  getAccountById = (id) => {
    return api.get(`/manage/driveAccount/${id}`)
  };

  submitAccountKey = (id, key) => {
    return api.post(`/manage/driveAccount/${id}/key`, btoa(JSON.stringify(JSON.parse(key))), true)
  };

  getAccountFiles = (id, page, size) => {
    return api.get(`/manage/driveAccount/${id}/files?page=${page}&size=${size}`)
  };

  getDownloadLink = (id, fileId) => {
    return api.get(`/manage/driveAccount/${id}/file/${fileId}/download`);
  };

  refreshQuota = (id) => {
    return api.get(`/manage/driveAccount/${id}/refreshQuota`);
  };

  getSharableLink = (accountId, fileId) => {
    return api.get(`/manage/driveAccount/${accountId}/file/${fileId}/sharableLink`);
  };

  uploadFile = (accountId, file) => {
    const metadata = {
      name : file.name,
    };
    console.log("File", file);
    console.log("File metadata", metadata);
    return new Promise((resolve, reject) => {
      api.get(`/manage/driveAccount/${accountId}/accessToken`).then(resp => {
        const accessToken = resp.accessToken;
        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        formData.append("file", file);
        api.driveUpload(formData, accessToken).then(resp => {
          resolve(resp)
        }).catch((...err) => {
          reject(...err)
        })
      })
    });
  };
}


const accountService = new AccountService();

export default accountService;