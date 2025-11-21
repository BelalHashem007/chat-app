import { Link } from "react-router";
function ErrorNotFound(){
    return(
        <div>Page not Found (404 Error) <Link to="/">Go to main page</Link></div>
    );
}

export default ErrorNotFound