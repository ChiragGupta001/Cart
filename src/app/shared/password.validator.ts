import {AbstractControl} from '@angular/forms';

export function PasswordValidator(control: AbstractControl):
    {[key : string]: boolean} | null{
        const password=control.get('Password');
        const ConfirmPassword = control.get('ConfirmPassword');
        if(password?.pristine || ConfirmPassword?.pristine){
            return null;
        }
        return password && ConfirmPassword && password.value != ConfirmPassword.value?{'misMatch': true}: null;
    }