<div>
	<p>
		{{$message}}
	</p>
	<img src="{{\route('LeadReplyController@onMailReply', [ 'lead' => $leadId, 'dealAction' => $dealActionId ])}}" width="1" height="1">
</div>
