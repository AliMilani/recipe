import Controller from './controller.mjs'

class User extends Controller {
    constructor() {
        super()
        this.self = this
    }

    create = async (req, res) => { }
    edit = async (req, res) => { }
    update = async (req, res) => { }
    delete = async (req, res) => { }
}

export default new User()
