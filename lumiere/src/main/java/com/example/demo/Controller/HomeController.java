package com.example.demo.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

    @RequestMapping(value = { "/", "/{path:^(?!api$).*$}", "/**/{path:^(?!api$).*$}" })
    public String forward() {
        return "forward:/index.html";
    }
}
