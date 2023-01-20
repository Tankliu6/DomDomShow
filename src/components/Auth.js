import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function AuthState(props) {
    const { isLoggedIn, setIsLoggedIn } = props;
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // login state
            const uid = user.uid;
            console.log(uid);
            setIsLoggedIn(true);
        } else {
            // not login yet
            console.log('Not login yet');
            setIsLoggedIn(false);
        }
    });
}
