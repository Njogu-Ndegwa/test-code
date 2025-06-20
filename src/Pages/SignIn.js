import React, {useEffect} from "react"
import {ReactComponent as Logo} from '../assets/logo.svg'

function SignIn() {

    useEffect(() => document.body.classList.add('form-membership'), []);

    return (
        <div className="form-wrapper">
            <div className="logo">
                <Logo/>
            </div>
            <h5>Sign in</h5>
            <form>
                <div className="form-group">
                    <input type="text" name="email" className="form-control" placeholder="Username or email"/>
                </div>
                <div className="form-group">
                    <input type="password" name="password" className="form-control" placeholder="Password"/>
                </div>
                <div className="form-group d-flex justify-content-between">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" checked="" id="customCheck1"/>
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                    <a href="/reset-password">Reset password</a>
                </div>
                <button className="btn btn-primary btn-block">Sign
                    in
                </button>
                <hr/>
                <p className="text-muted">Login with your social media account.</p>
                <ul className="list-inline">
                    <li className="list-inline-item">
                        <a href="/" className="btn btn-floating btn-facebook">
                            <i className="fa fa-facebook"></i>
                        </a>
                    </li>
                    <li className="list-inline-item">
                        <a href="/" className="btn btn-floating btn-twitter">
                            <i className="fa fa-twitter"></i>
                        </a>
                    </li>
                    <li className="list-inline-item">
                        <a href="/" className="btn btn-floating btn-dribbble">
                            <i className="fa fa-dribbble"></i>
                        </a>
                    </li>
                    <li className="list-inline-item">
                        <a href="/" className="btn btn-floating btn-linkedin">
                            <i className="fa fa-linkedin"></i>
                        </a>
                    </li>
                    <li className="list-inline-item">
                        <a href="/" className="btn btn-floating btn-google">
                            <i className="fa fa-google"></i>
                        </a>
                    </li>
                    <li className="list-inline-item">
                        <a href="/" className="btn btn-floating btn-behance">
                            <i className="fa fa-behance"></i>
                        </a>
                    </li>
                    <li className="list-inline-item">
                        <a href="/" className="btn btn-floating btn-instagram">
                            <i className="fa fa-instagram"></i>
                        </a>
                    </li>
                </ul>
                <hr/>
                <p className="text-muted">Don't have an account?</p>
                <a href="/sign-up" className="btn btn-outline-light btn-sm">Register now!</a>
            </form>
        </div>
    )
}

export default SignIn
