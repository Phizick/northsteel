import {makeObservable} from "mobx";

class UserStore {
    userName: string | null = null;
    userAvatar: string | null = null;

    constructor() {
        makeObservable(this)
    }

    getUser = () => {
        this.userName = 'Тест тест'
    }

}

export default new UserStore()