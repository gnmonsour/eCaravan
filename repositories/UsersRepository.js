const fs = require('fs');
const crypto = require('crypto');

class UsersRepository {
	constructor(filename) {
		if (!filename) {
			throw new Error('A filename is needed to create this repository.');
		}

        if(!UsersRepository.singleton) {

            this.filename = filename;
            
            try {
                fs.accessSync(filename);
            } catch (err) {
                fs.writeFileSync(this.filename, '[]');
                console.log('file created');
            }
            UsersRepository.singleton = this;
        }
        return UsersRepository.singleton;
	}

	async getAll() {
		return  JSON.parse( await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
    }

    async create(attrs) {
        attrs.id = this.createRandomId();
        const users = await this.getAll();
        users.push(attrs);
        this.writeAll(users);
        return attrs;
    }
    
    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2), {encoding: 'utf8'});

    }

    createRandomId() {
        return crypto.randomBytes(4).toString("hex");
    }

    async getOne(id) {
        const users = await this.getAll();
        return users.find(user => user.id === id);
    }

    async delete(id) {
        const users = await this.getAll();
        const updatedUsers = users.filter(user => user.id !== id);
        await this.writeAll(updatedUsers);
    }
    
    async update(id, attrs) {
        const users = await this.getAll();
        const user = users.find(user => user.id === id);
        if(!user) {
            throw new Error(`User with id ${id} not found`);
        }
        Object.assign(user, attrs);
        await this.writeAll(users);
    }

    async getFirst(filters){
        const users = await this.getAll();
        const keys = Object.keys(filters);
        for(let user of users) {
            let isFound = true;
            for(let key of keys) {
                if(user[key] !== filters[key]){
                    isFound = false;
                    break;    // break out of the inner loop
                }
            }
            if(isFound) return user;
        }
        return undefined;
    }
}

const instance = new UsersRepository('users_repo.json');
Object.freeze(instance);

module.exports = instance;

// const test = async () => {
//     const repo = new UsersRepository('users.json');
//     // await repo.create({'email': "g@g", "password": "raptors", "passwordConfirmation": "repeat"});
// 	// const users = await repo.getAll();
//     // console.log(users);
//     // await repo.update("47b3ff3d", {"password": "repeat"});
//     // console.log(await repo.getOne("47b3ff3d"));
//     // repo.delete("cf051b95");
// 	// const users = await repo.getAll();
//     // console.log(users);

//     // const user = await repo.getFirst({password: 'raptors', id: 'ea114df7'});
//     const user = await repo.getFirst({'ea114df7': 'you'});
//     console.log(`found user ${JSON.stringify(user)}`);
// };

// test();
