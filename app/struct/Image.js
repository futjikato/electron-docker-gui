// @flow
type SubmoduleType = {
  id: string,
  status: string,
  progress: number
};

export default class Image {
  id: ?string;
  name: string;
  status: string = 'Unknown';
  submodules: Array<SubmoduleType> = [];

  constructor(name: string) {
    this.name = name;
  }

  setSubmoduleState(id: string, status: string, progress: ?number = 0) {
    let updated = false;
    this.submodules = this.submodules.map((subModule) => {
      if (subModule.id === id) {
        updated = true;
        return {
          id: id,
          status: status,
          progress: progress
        };
      }
      return subModule
    });

    if (!updated) {
      this.submodules.push({
        id: id,
        status: status,
        progress: progress
      });
    }
  }

  finishLoading(id: string) {
    this.id = id;
    // clear submodules after finished loading
    this.submodules = {};
    // clear status text
    this.status = '';
  }
}