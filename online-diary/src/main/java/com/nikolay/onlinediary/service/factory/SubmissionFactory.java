package com.nikolay.onlinediary.service.factory;

import com.nikolay.onlinediary.domain.Submission;
import com.nikolay.onlinediary.dto.SubmissionDto;
import com.nikolay.onlinediary.service.time.TimeProvider;
import org.springframework.stereotype.Component;

@Component
public class SubmissionFactory {

    private final TimeProvider timeProvider;

    public SubmissionFactory(TimeProvider timeProvider) {
        this.timeProvider = timeProvider;
    }

    public Submission createFromDto(SubmissionDto dto) {
        Submission submission = new Submission();
        return applyDto(dto, submission);
    }

    public Submission applyDto(SubmissionDto dto, Submission target) {
        target.setStudentId(dto.getStudentId());
        target.setSubjectId(dto.getSubjectId());
        target.setContent(dto.getContent());
        target.setSubmittedAt(dto.getSubmittedAt() != null ? dto.getSubmittedAt() : timeProvider.now());
        return target;
    }
}
