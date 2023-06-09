<style>


	.emailbody {
		width:100%;
		height:100%;
		display:block;
		margin:0 auto;
		background:#f1f4f5;
		padding: 60px 0;
	}

	.bigcont {
		max-width: 380px;
		background:#fff;
		border: 1px dashed #b3b3b3;
		padding: 55px;
		margin: 0 auto;
		border-radius: 6px;
		color:#3c3a4e;
	}

	.emailfot {
		max-width: 450px;
		text-align: left;
		font-size: 12px;
		margin: 20px auto;
		color:#797979;

	}

	.toplogocont {
		text-align:center;
		display:block;
		width:100%;
	}

	.toplogocont img {
		width: 120px;
		margin: 10px auto !important;
		text-align: center;
		padding: 15px;
		display:block;
	}

	.bigcont p {
		font-size: 18px;
		font-family: Arial, sans-serif;
		font-weight: 400;
		line-height: 26px;
	}

	.bigcont h1 {
		font-size: 17px;
		font-family: Arial, sans-serif;
		font-weight: 600;
		color:#3c3a4e;
	}

	.bigcont h2 {
		font-size: 17px;
		font-family: Arial, sans-serif;
		font-weight: 600;
	}

	.bigcont a {

		display: block;
		background:#4d77ff;
		color: #fff;
		font-size: 16px;
		font-weight: bold;
		font-family: Arial,sans-serif;
		margin: 30px auto;
		padding: 12px 30px;
		border-radius: 3px;
		text-decoration: none;
		text-align: center;
		white-space: nowrap;
		box-sizing: border-box;

	}

	.bigcont .smallnote {

		font-size:12px;
		text-align:center;
	}

	.bigcont .smallnote a {

		color:#4d77ff;
		text-decoration:none ;
		background:transparent;
		font-size:12px;
		padding:unset !important;
		display:inline;
	}

</style>

<div class="emailbody" style="width:100%; height:100%; display:block; margin:0 auto; background:#f1f4f5; padding: 60px 0; ">
	<div class="toplogocont" style="text-align:center; display:block; width:100%; "><img src="https://app.convertlead.com/img/logo.png" style="width: 120px; margin: 10px auto !important; text-align: center; padding: 15px; display:block;"></img></div>
	<div class="bigcont" style="max-width: 320px;background: #fff;border: 1px solid #dfdff0 !important;padding: 70px 55px 55px 55px;margin: 0 auto;border-radius: 10px;color: #354771;box-shadow: 0 1px 1px rgba(225,225,240,.9);">
		<p style="font-size: 18px; font-family: Arial, sans-serif; font-weight: 400; line-height: 26px; ">Hey {{ $agency->name  }}, </br></br> Thanks for signing up to ConvertLead. We’re happy to have you ! </p>
		<p style="font-size: 18px; font-family: Arial, sans-serif; font-weight: 400; line-height: 26px; ">You can access your account using the following details: </p>

		<h1 style=" font-size: 17px; font-family: Arial, sans-serif; font-weight: 600; color:#3c3a4e; ">User: {{ $agency->email  }}</h1>
		<h1 style=" font-size: 17px; font-family: Arial, sans-serif; font-weight: 600; color:#3c3a4e; ">Password: {{ $password }}</h1>

		<a href="https://app.convertlead.com"  style="display: block; background:#4d77ff; color: #fff; font-size: 16px; font-weight: bold; font-family: Arial,sans-serif; margin: 30px auto; padding: 12px 30px; border-radius: 3px; text-decoration: none; text-align: center;
		white-space: nowrap; box-sizing: border-box; ">Go to login page</a>
		<p class="smallnote" style="font-size:12px ; text-align:center ; ">Need Help? <a href="http://support.convertlead.com">Let us know</a></p>

	</div>
	<div class="emailfot" style="max-width: 420px; text-align: left; font-size: 12px; margin: 20px auto; color:#797979;">
		This is an automated message. Please do not reply. You are receiving this email because you have an agent account on ConvertLead. If you wish to unsubscribe, please visit your ConvertLead settings
	</div>

</div>







