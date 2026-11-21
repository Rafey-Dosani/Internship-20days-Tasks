<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Dashboard') | Catalog Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        :root {
            --ink: #17243b;
            --muted: #718096;
            --line: #e8edf4;
            --canvas: #f5f7fb;
            --brand: #3457d5;
            --sidebar: #17243b;
        }

        body {
            min-height: 100vh;
            color: var(--ink);
            background: var(--canvas);
            font-size: .94rem;
        }

        .app-shell { min-height: 100vh; }
        .sidebar {
            width: 252px;
            flex: 0 0 252px;
            padding: 1.5rem 1rem;
            color: #d7dfef;
            background: var(--sidebar);
        }
        .brand {
            display: flex;
            align-items: center;
            gap: .75rem;
            margin: 0 .65rem 2.4rem;
            color: #fff;
            font-size: 1.05rem;
            font-weight: 700;
            text-decoration: none;
        }
        .brand-mark {
            display: grid;
            width: 2.2rem;
            height: 2.2rem;
            place-items: center;
            border-radius: .7rem;
            color: #fff;
            background: var(--brand);
        }
        .nav-label {
            margin: 0 .75rem .65rem;
            color: #8492aa;
            font-size: .68rem;
            font-weight: 700;
            letter-spacing: .12em;
            text-transform: uppercase;
        }
        .sidebar .nav-link {
            display: flex;
            align-items: center;
            gap: .75rem;
            margin-bottom: .3rem;
            padding: .7rem .8rem;
            border-radius: .65rem;
            color: #b7c3d6;
            font-weight: 500;
        }
        .sidebar .nav-link:hover,
        .sidebar .nav-link.active {
            color: #fff;
            background: #293852;
        }
        .nav-indicator {
            width: .45rem;
            height: .45rem;
            border: 1px solid currentColor;
            border-radius: 50%;
        }
        .main-panel { min-width: 0; flex: 1; }
        .topbar {
            display: flex;
            min-height: 76px;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 2.25rem;
            border-bottom: 1px solid var(--line);
            background: #fff;
        }
        .topbar-label { color: var(--muted); font-size: .82rem; }
        .content-wrap { max-width: 1440px; margin: auto; padding: 2rem 2.25rem 3rem; }
        .page-title { margin: 0; font-size: 1.55rem; font-weight: 700; letter-spacing: -.03em; }
        .page-subtitle { margin: .35rem 0 0; color: var(--muted); }
        .panel {
            border: 1px solid var(--line);
            border-radius: .9rem;
            background: #fff;
            box-shadow: 0 4px 18px rgb(23 36 59 / 3%);
        }
        .panel-header { padding: 1.15rem 1.35rem; border-bottom: 1px solid var(--line); }
        .panel-body { padding: 1.35rem; }
        .stat-card { display: flex; min-height: 150px; align-items: center; gap: 1rem; padding: 1.35rem; }
        .stat-icon {
            display: grid;
            width: 3rem;
            height: 3rem;
            flex: 0 0 3rem;
            place-items: center;
            border-radius: .9rem;
            color: var(--brand);
            background: #edf1ff;
            font-weight: 700;
        }
        .stat-label { color: var(--muted); font-weight: 500; }
        .stat-value { margin-top: .2rem; font-size: 1.8rem; font-weight: 700; line-height: 1.2; }
        .table { margin: 0; }
        .table thead th {
            padding: .9rem 1rem;
            border-bottom-color: var(--line);
            color: var(--muted);
            background: #fafbfd;
            font-size: .72rem;
            font-weight: 700;
            letter-spacing: .06em;
            text-transform: uppercase;
            white-space: nowrap;
        }
        .table tbody td { padding: .95rem 1rem; border-bottom-color: var(--line); vertical-align: middle; }
        .table tbody tr:last-child td { border-bottom: 0; }
        .form-label { color: #35435b; font-size: .86rem; font-weight: 600; }
        .form-control, .form-select { min-height: 44px; border-color: #dce3ed; border-radius: .55rem; }
        textarea.form-control { min-height: 110px; }
        .form-control:focus, .form-select:focus { border-color: #97aaf3; box-shadow: 0 0 0 .2rem rgb(52 87 213 / 12%); }
        .btn { border-radius: .55rem; font-weight: 600; }
        .btn-primary { border-color: var(--brand); background: var(--brand); }
        .btn-primary:hover { border-color: #2848bb; background: #2848bb; }
        .pagination { margin: 0; }
        .pagination .page-link { color: var(--brand); }
        .pagination .active .page-link { border-color: var(--brand); background: var(--brand); }
        .empty-state { padding: 3rem 1rem !important; color: var(--muted); text-align: center; }

        @media (max-width: 767.98px) {
            .app-shell { display: block !important; }
            .sidebar { width: 100%; padding: 1rem; }
            .brand { margin: 0 .3rem .9rem; }
            .nav-label { display: none; }
            .sidebar nav { display: flex; flex-direction: row; flex-wrap: wrap; gap: .4rem; }
            .sidebar .nav-link { margin: 0; padding: .55rem .7rem; }
            .topbar { min-height: 62px; padding: .8rem 1rem; }
            .content-wrap { padding: 1.35rem 1rem 2rem; }
            .table thead th, .table tbody td { padding-right: .7rem; padding-left: .7rem; }
        }
    </style>
</head>
<body>
<div class="app-shell d-flex">
    <aside class="sidebar">
        <a class="brand" href="{{ route('web.dashboard') }}">
            <span class="brand-mark">C</span>
            <span>Catalog Admin</span>
        </a>
        <p class="nav-label">Workspace</p>
        <nav class="nav flex-column" aria-label="Main navigation">
            <a class="nav-link {{ request()->routeIs('web.dashboard') ? 'active' : '' }}" href="{{ route('web.dashboard') }}">
                <span class="nav-indicator" aria-hidden="true"></span> Dashboard
            </a>
            <a class="nav-link {{ request()->routeIs('web.categories.*') ? 'active' : '' }}" href="{{ route('web.categories.index') }}">
                <span class="nav-indicator" aria-hidden="true"></span> Categories
            </a>
            <a class="nav-link {{ request()->routeIs('web.products.*') ? 'active' : '' }}" href="{{ route('web.products.index') }}">
                <span class="nav-indicator" aria-hidden="true"></span> Products
            </a>
        </nav>
    </aside>

    <div class="main-panel">
        <header class="topbar">
            <div>
                <div class="fw-semibold">@yield('heading', 'Dashboard')</div>
                <div class="topbar-label">Category and product management</div>
            </div>
            <span class="badge rounded-pill text-bg-light border px-3 py-2">Admin workspace</span>
        </header>

        <main class="content-wrap">
            @if (session('status'))
                <div class="alert alert-success alert-dismissible fade show" role="status">
                    {{ session('status') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            @endif

            @if ($errors->any())
                <div class="alert alert-danger" role="alert">
                    <p class="mb-1 fw-semibold">Please correct the following:</p>
                    <ul class="mb-0">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @yield('content')
        </main>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
