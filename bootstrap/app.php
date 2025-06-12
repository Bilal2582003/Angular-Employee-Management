<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        api: __DIR__.'/../routes/api.php'
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append([
             \App\Http\Middleware\CorsMiddleware::class,
             \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);
        $middleware->validateCsrfTokens(except: [
        'api/EmpoyeeManagemet/login',
        'api/EmpoyeeManagemet/register',
        'api/EmpoyeeManagemet/updateEmployee',
        'api/EmpoyeeManagemet/createProject',
    ]); 
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (AuthenticationException $e, $request) {
            return response()->json(['message' => 'Un-Authorized User'], 401);
        });
        //
    })->create();
