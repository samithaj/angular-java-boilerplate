package com.example.modules.person;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/persons")
public class PersonController {

    private final PersonRepository personRepository;

    public PersonController(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @GetMapping
    public Map<String, Object> getAllPersons() {
        List<Person> persons = personRepository.findAll();
        return Map.of(
            "success", true,
            "data", persons
        );
    }

    @PostMapping
    public Map<String, Object> createPerson(@RequestBody Person person) {
        Person saved = personRepository.save(person);
        return Map.of(
            "success", true,
            "data", saved
        );
    }
}
