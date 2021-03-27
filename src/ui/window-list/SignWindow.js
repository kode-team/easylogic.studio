import BaseWindow from "./BaseWindow";
import { EVENT } from "@sapa/UIElement";
import { CLICK } from "@sapa/Event";
import { registElement } from "@sapa/registerElement";

export default class SignWindow extends BaseWindow {

    getClassName() {
        return 'sign-window'
    }

    getTitle() {
        return 'Sign'
    }

    getBody() {
        return /*html*/`
            <div >
                <label>fullname <input type="text" ref="$fullname" /></label>
                <label>email <input type="text" ref="$email" /></label>
                <label>password <input type="text" ref="$password" /></label>
                <button type="button" ref='$register'>Register</button>
            </div>
        `
    }

    [CLICK('$register')] () {
        console.log(firebase);

        var email = this.refs.$email.value; 
        var password = this.refs.$password.value; 

        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(error);
        // ...
        });

    }

    [EVENT('showSignWindow')] () {
        this.show();
    }

}

registElement({ SignWindow })