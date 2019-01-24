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
}


const accountService = new AccountService();

export default accountService;