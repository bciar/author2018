<template>
<div>
	<div id="loginMenu" className="container">
    <div className="row" id="loginMenu2">
        <div className="col-md-4"></div>
        <div className="col-md-4 login-box">
            <div className="col-lg-12 login-key">
                <i className="fa fa-key"></i>
            </div>
            <div className="col-lg-12 login-title">
            </div>
            <div className="col-lg-12 login-form">
                <div className="col-lg-12 login-form">
                    <input id="txtEmail" className="form-control" type="email" placeholder = "Email"></input>
                    <input id="txtPassword" className="form-control" type="password" placeholder="Password"></input>
                </div>
                <div className="col-lg-12 loginbttm">
                    <div className="col-lg-12 login-btm login-text">
                    </div>
                    <div className="col-lg-12 login-btm login-button">
                        <button id="btnLogin" className="btn btn-outline-primary" onClick={this.login}>Login</button>
                        <button id="btnSignUp" className="btn btn-outline-primary" onClick={this.signup}>Sign up</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</div>
</template>

<script>
	import jQuery from 'jquery/dist/jquery.js'
  	import $ from 'jquery/dist/jquery.js'
  	import modal from 'bootstrap/dist/css/bootstrap.css'
	export default {
		name: 'Login',

	}
</script>
<style scoped>

</style>