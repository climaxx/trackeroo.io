function Login() {
	window.location.href = '/employees';

	var loginForm = "div.ui.form.login.trackeroo";

	// check if the required fields are empty
	$(loginForm).form({
        inline: false,
        fields: {
            username: {
                identifier: 'username',
                rules: [{
                    type: 'empty',
                    prompt: 'Please type your "Username"'
                }]
            },
            password: {
                identifier: 'password',
                rules: [{
                    type: 'empty',
                    prompt: 'Please type your "Password"'
                }]
            }
        }
    });
};
