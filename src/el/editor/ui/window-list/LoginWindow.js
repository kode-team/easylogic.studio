import BaseWindow from "./BaseWindow";
import { registElement } from "el/base/registElement"
import { CLICK, SUBSCRIBE } from "el/base/Event";


export default class LoginWindow extends BaseWindow {

    getClassName() {
        return 'login-window'
    }

    getTitle() {
        return 'Login'
    }

    getBody() {
        return /*html*/`
            <div >
                <label>email <input type="text" ref="$email" /></label>
                <label>password <input type="text" ref="$password" /></label>
                <button type="button" ref='$login'>Login</button>
            </div>
        `
    }

    [CLICK('$login')] (e) {

        var email = this.refs.$email.value; 
        var password = this.refs.$password.value; 

        firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
            this.$editor.setUser(user)
            this.hide();
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(error);
            // ...
          });
    }

    [SUBSCRIBE('showLoginWindow')] () {
        this.show();
    }

}

registElement({ LoginWindow })