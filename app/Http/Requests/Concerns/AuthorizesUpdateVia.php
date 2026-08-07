<?php

namespace App\Http\Requests\Concerns;

trait AuthorizesUpdateVia
{
    protected function authorizeUpdate(string $routeParam): bool
    {
        return $this->user()->can('update', $this->route($routeParam));
    }
}
