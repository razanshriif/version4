package com.example.demo.script;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.Repository.EventsRepository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class FileConversionController {

   @Autowired
   private FileConversionService fileConversionService;

   @Autowired
   private EventsRepository eventsRepository;

   @GetMapping("/convert")
   public String convertFileAndGetResults() {
      fileConversionService.updateOrderStatus();
      return "ok";
   }

   @GetMapping("/event")
   public List<?> executeScript(@RequestParam String param) {
      return fileConversionService.executePythonScript(param);
   }

   @PostMapping("/updateEvents")
   public Set<String> updateOrdrevent(@RequestParam String param) {

      return fileConversionService.updateOrdrevent(param);

   }

   @DeleteMapping("/{id}")
   public void delevent(@PathVariable String id) {
      eventsRepository.deleteAllByVoycle(id);
   }

}