import { Button } from 'flowbite-react';
import { AiFillFacebook } from 'react-icons/ai';
import { FacebookAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuthFb() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFacebookClick = async () => {
        const provider = new FacebookAuthProvider();
        provider.setCustomParameters({ display: 'popup' });

        try {
            const resultsFromFacebook = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/facebook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromFacebook.user.displayName,
                    email: resultsFromFacebook.user.email,
                    facebookPhotoUrl: resultsFromFacebook.user.photoURL,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleFacebookClick}>
            <AiFillFacebook className='w-6 h-6 mr-2'/>
            Continue with Facebook
        </Button>
    );
}
