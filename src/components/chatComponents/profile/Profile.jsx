import { useOutletContext } from "react-router";

function Profile(){
    const [user] = useOutletContext();
    return(
        <div>
            <div>Name: {user.displayName}</div>
            <div>Email: {user.email}</div>
            <div>uid: {user.uid}</div>
        </div>
    );
}

export default Profile;