<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $required = $this->isMethod('PATCH') ? ['sometimes', 'required'] : ['required'];

        return [
            'category_id' => [...$required, 'integer', 'exists:categories,id'],
            'name' => [...$required, 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'price' => [...$required, 'numeric', 'decimal:0,2', 'min:0', 'max:99999999.99'],
        ];
    }
}
