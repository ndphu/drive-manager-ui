const MultipartDownload = require('multipart-download');
// import MultipartDownload from 'multipart-download';

function guid() {
  return "ss-s-s-s-sss".replace(/s/g, s4);
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

class DownloadService {

  downloads = {};
  downloadIds = [];

  downloadDriveFile = (fileName, url, callback) => {
    const downloadGuid = guid();
    this.downloads[downloadGuid] = {
      id: downloadGuid,
      fileName: fileName,
      url: url,
      completed: false,
      current: 0,
      total: 0,
    };
    this.downloadIds.push(downloadGuid);
    return new MultipartDownload()
      .start(url, {
        numOfConnections: 8,
        writeToBuffer: true,
        forceParallel: true,
      }).on('progress', (current, total) => {
        let downloadState = this.downloads[downloadGuid];
        downloadState.current = current;
        downloadState.total = total;
        if (callback && callback.onProgress) {
          callback.onProgress(downloadGuid, current, total);
        }
        if (downloadState.callback && downloadState.callback.onProgress) {
          downloadState.callback.onProgress(downloadGuid, current, total);
        }

      }).on('end', (data) => {
        let downloadState = this.downloads[downloadGuid];
        downloadState.completed = true;
        if (callback && callback.onCompleted) {
          callback.onCompleted(downloadGuid);
        }
        if (downloadState.callback && downloadState.callback.onCompleted) {
          downloadState.callback.onCompleted(downloadGuid);
        }
        const blob = new Blob([data], {type: "octet/stream"});
        const url = window.URL.createObjectURL(blob);
        const dummyLink = document.createElement('a');
        dummyLink.href = url;
        dummyLink.download = fileName;
        dummyLink.target = "__blank";
        dummyLink.click();
      })
  };

  getDownloadIds = () => {
    return this.downloadIds;
  };

  getDownload = (id) => {
    return this.downloads[id];
  };

  downloadSource = (source) => {
    const downloadGuid = guid();
    this.downloads[downloadGuid] = {
      id: downloadGuid,
      fileName: source.fileName,
      url: source.source,
      completed: false,
      current: 0,
      total: 0,
    };
    this.downloadIds.push(downloadGuid);

    this.startDownload(downloadGuid);
  };

  downloadSources = (sources) => {
    sources.forEach((s) => {
      this.downloadSource(s)
    });
  };

  startDownload = (uuid) => {
    const download = this.downloads[uuid];
    new MultipartDownload()
      .start(download.url, {
        numOfConnections: 8,
        writeToBuffer: true,
        forceParallel: true,
      })
      .on('progress', (current, total) => {
        download.current = current;
        download.total = total;
      })
      .on('end', (data) => {
        download.completed = true;
        const blob = new Blob([data], {type: "octet/stream"});
        const url = window.URL.createObjectURL(blob);
        const dummyLink = document.createElement('a');
        dummyLink.href = url;
        dummyLink.download = download.fileName;
        dummyLink.target = "__blank";
        dummyLink.click();
      })
  }
}

const downloadService = new DownloadService();

export default downloadService;