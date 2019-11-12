<h1>
    Dear {{ $user->name  }},
</h1>
<p>
    Report status: <strong>{{ $report->status  }}</strong>
</p>
<p>
    Report period: <strong>{{ $query->startDate  }}</strong> - <strong>{{ $query->endDate }}</strong>
</p>
<p>
    <a href="{{ $file }}">Download Report</a>
</p>