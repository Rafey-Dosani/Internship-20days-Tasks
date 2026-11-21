@extends('layouts.app')

@section('title', 'Create category')
@section('heading', 'Categories')

@section('content')
    <div class="mb-4">
        <h1 class="page-title">Create category</h1>
        <p class="page-subtitle">Add a category to organize your products.</p>
    </div>
    <section class="panel">
        <div class="panel-body">
            @include('categories.form', [
                'action' => route('web.categories.store'),
                'buttonText' => 'Create category',
            ])
        </div>
    </section>
@endsection
