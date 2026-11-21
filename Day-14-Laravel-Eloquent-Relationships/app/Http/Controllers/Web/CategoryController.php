<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;

class CategoryController extends Controller
{
    public function index(): View
    {
        return view('categories.index', [
            'categories' => Category::query()
                ->withCount('products')
                ->orderBy('name')
                ->paginate(10),
        ]);
    }

    public function create(): View
    {
        return view('categories.create', [
            'category' => new Category,
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        Category::query()->create($request->validated());

        return redirect()
            ->route('web.categories.index')
            ->with('status', 'Category created successfully.');
    }

    public function edit(Category $category): View
    {
        return view('categories.edit', [
            'category' => $category,
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $category->update($request->validated());

        return redirect()
            ->route('web.categories.index')
            ->with('status', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()
            ->route('web.categories.index')
            ->with('status', 'Category deleted successfully.');
    }
}
